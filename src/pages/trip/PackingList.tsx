import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface PackingItem {
  name: string;
  description?: string;
  canBorrow?: boolean;
  checked?: Record<string, boolean>;
}

interface PackingCategory {
  name: string;
  items: PackingItem[];
}

interface PackingListData {
  common?: {
    categories: PackingCategory[];
  };
  perPerson?: {
    categories: PackingCategory[];
  };
}

interface Trip {
  id: string;
  title: string;
  packing_list_data: Json | null;
}

const PEOPLE = ["Stan", "Nero", "Jonas"];

const CommonPackingSection = ({ 
  category, 
  categoryIdx,
  onToggle 
}: { 
  category: PackingCategory; 
  categoryIdx: number;
  onToggle: (person: string, categoryIdx: number, itemIdx: number) => void;
}) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
    <ul className="space-y-4">
      {category.items.map((item, idx) => (
        <li key={idx} className="space-y-2">
          <div className="text-sm">
            <span className="font-medium text-foreground">{item.name}</span>
            {item.description && (
              <span className="text-muted-foreground">: {item.description}</span>
            )}
            {item.canBorrow && (
              <span className="text-primary ml-2 text-xs">(Te lenen)</span>
            )}
          </div>
          <div className="flex gap-4 pl-6">
            {PEOPLE.map((person) => {
              const isChecked = item.checked?.[person] || false;
              return (
                <div key={person} className="flex items-center gap-2">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onToggle(person, categoryIdx, idx)}
                  />
                  <span className={`text-sm ${isChecked ? "line-through opacity-60" : ""}`}>
                    {person}
                  </span>
                </div>
              );
            })}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const PersonalPackingSection = ({ 
  category, 
  person, 
  categoryIdx,
  onToggle 
}: { 
  category: PackingCategory; 
  person: string; 
  categoryIdx: number;
  onToggle: (person: string, categoryIdx: number, itemIdx: number) => void;
}) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
    <ul className="space-y-2">
      {category.items.map((item, idx) => {
        const isChecked = item.checked?.[person] || false;
        return (
          <li key={idx} className="flex items-start gap-3 text-sm">
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => onToggle(person, categoryIdx, idx)}
              className="mt-0.5"
            />
            <div className={isChecked ? "line-through opacity-60" : ""}>
              <span className="font-medium text-foreground">{item.name}</span>
              {item.description && (
                <span className="text-muted-foreground">: {item.description}</span>
              )}
              {item.canBorrow && (
                <span className="text-primary ml-2 text-xs">(Te lenen)</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  </div>
);

export const PackingList = () => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(PEOPLE[0]);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip = async () => {
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("id, title, packing_list_data")
        .eq("slug", "toerski-moelleux-club")
        .eq("is_public", true)
        .maybeSingle();

      if (error) throw error;
      if (data) setTrip(data);
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (person: string, categoryIdx: number, itemIdx: number) => {
    if (!trip?.packing_list_data) return;
    
    const packingData = trip.packing_list_data as PackingListData;
    const updatedData = JSON.parse(JSON.stringify(packingData));
    
    if (updatedData.perPerson?.categories[categoryIdx]?.items[itemIdx]) {
      const item = updatedData.perPerson.categories[categoryIdx].items[itemIdx];
      if (!item.checked) item.checked = {};
      item.checked[person] = !item.checked[person];
      
      const { error } = await supabase
        .from("trips")
        .update({ packing_list_data: updatedData as unknown as Json })
        .eq("slug", "toerski-moelleux-club");
      
      if (!error) {
        setTrip({ ...trip, packing_list_data: updatedData as unknown as Json });
      }
    }
  };

  const toggleCommonItem = async (person: string, categoryIdx: number, itemIdx: number) => {
    if (!trip?.packing_list_data) return;
    
    const packingData = trip.packing_list_data as PackingListData;
    const updatedData = JSON.parse(JSON.stringify(packingData));
    
    if (updatedData.common?.categories[categoryIdx]?.items[itemIdx]) {
      const item = updatedData.common.categories[categoryIdx].items[itemIdx];
      if (!item.checked) item.checked = {};
      item.checked[person] = !item.checked[person];
      
      const { error } = await supabase
        .from("trips")
        .update({ packing_list_data: updatedData as unknown as Json })
        .eq("slug", "toerski-moelleux-club");
      
      if (!error) {
        setTrip({ ...trip, packing_list_data: updatedData as unknown as Json });
      }
    }
  };

  const addCustomItem = async (person: string) => {
    if (!newItemName.trim() || !trip?.packing_list_data) return;
    
    const packingData = trip.packing_list_data as PackingListData;
    const updatedData = JSON.parse(JSON.stringify(packingData));
    
    if (!updatedData.perPerson) {
      updatedData.perPerson = { categories: [] };
    }
    
    let customCategory = updatedData.perPerson.categories.find(c => c.name === "Custom Items");
    if (!customCategory) {
      customCategory = { name: "Custom Items", items: [] };
      updatedData.perPerson.categories.push(customCategory);
    }
    
    customCategory.items.push({ name: newItemName.trim(), checked: {} });
    
    const { error } = await supabase
      .from("trips")
      .update({ packing_list_data: updatedData as unknown as Json })
      .eq("slug", "toerski-moelleux-club");
    
    if (!error) {
      setTrip({ ...trip, packing_list_data: updatedData as unknown as Json });
      setNewItemName("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Packing List</h1>
      <div className="space-y-6">
        {trip?.packing_list_data && typeof trip.packing_list_data === 'object' && 'common' in trip.packing_list_data && (
          <Card>
            <CardHeader>
              <CardTitle>Groepsmateriaal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {((trip.packing_list_data as PackingListData).common?.categories || []).map((category, idx) => (
                <CommonPackingSection 
                  key={idx} 
                  category={category} 
                  categoryIdx={idx}
                  onToggle={toggleCommonItem}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {trip?.packing_list_data && typeof trip.packing_list_data === 'object' && 'perPerson' in trip.packing_list_data && (
          <Card>
            <CardHeader>
              <CardTitle>Persoonlijke Packing List</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedPerson} onValueChange={setSelectedPerson}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  {PEOPLE.map((person) => (
                    <TabsTrigger key={person} value={person}>
                      {person}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {PEOPLE.map((person) => (
                  <TabsContent key={person} value={person} className="space-y-6">
                    {((trip.packing_list_data as PackingListData).perPerson?.categories || []).map((category, idx) => (
                      <PersonalPackingSection 
                        key={idx} 
                        category={category} 
                        person={person} 
                        categoryIdx={idx}
                        onToggle={toggleItem}
                      />
                    ))}
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Voeg item toe</h3>
                      <div className="flex gap-2">
                        <Input
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="Nieuw item..."
                          onKeyDown={(e) => e.key === "Enter" && addCustomItem(person)}
                        />
                        <Button onClick={() => addCustomItem(person)} size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        )}

        {!trip?.packing_list_data && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No packing list available yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
